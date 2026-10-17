import Foundation
import Capacitor
import CoreLocation
import UserNotifications

/// "Leaving home" for iPhone: the system watches a circle around home and wakes Timbre Tamer when you cross it,
/// even if the app is closed. Nothing runs in the background while you are at home or away.
final class LeaveFenceCore: NSObject, CLLocationManagerDelegate {
    static let shared = LeaveFenceCore()
    private let mgr = CLLocationManager()
    private let d = UserDefaults.standard
    private var pendingPosition: [(Result<CLLocation, Error>) -> Void] = []
    private let gapMinutes = 45.0

    override init() {
        super.init()
        mgr.delegate = self
    }

    /// Called at app launch so a background relaunch (because you crossed the circle) reaches the delegate.
    func attach() { mgr.delegate = self }

    // MARK: setup from the web app
    func configure(lat: Double?, lng: Double?, radius: Double, n: Int, items: [[String: Any]]) {
        for r in mgr.monitoredRegions { mgr.stopMonitoring(for: r) }
        guard let lat = lat, let lng = lng, !items.isEmpty,
              let data = try? JSONSerialization.data(withJSONObject: items),
              let json = String(data: data, encoding: .utf8) else { return }
        d.set(json, forKey: "lf.items"); d.set(n, forKey: "lf.n")
        if mgr.authorizationStatus == .authorizedWhenInUse { mgr.requestAlwaysAuthorization() }
        else if mgr.authorizationStatus == .notDetermined { mgr.requestWhenInUseAuthorization() }
        let region = CLCircularRegion(center: CLLocationCoordinate2D(latitude: lat, longitude: lng), radius: min(max(radius, 100), mgr.maximumRegionMonitoringDistance), identifier: "home")
        region.notifyOnEntry = true; region.notifyOnExit = true
        mgr.startMonitoring(for: region)
    }

    func currentPosition(_ done: @escaping (Result<CLLocation, Error>) -> Void) {
        pendingPosition.append(done)
        switch mgr.authorizationStatus {
        case .notDetermined: mgr.requestWhenInUseAuthorization()
        case .denied, .restricted: finishPosition(.failure(NSError(domain: "leavefence", code: 1, userInfo: [NSLocalizedDescriptionKey: "Location is off for Timbre Tamer"]))); return
        default: mgr.requestLocation()
        }
    }
    private func finishPosition(_ r: Result<CLLocation, Error>) { let cbs = pendingPosition; pendingPosition = []; cbs.forEach { $0(r) } }

    func takeRoute() -> String? {
        defer { d.removeObject(forKey: "lf.route"); d.removeObject(forKey: "lf.routeAt") }
        guard let r = d.string(forKey: "lf.route"), Date().timeIntervalSince1970 - d.double(forKey: "lf.routeAt") < 3 * 3600 else { return nil }
        return r
    }

    // MARK: delegate
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if !pendingPosition.isEmpty, manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways { manager.requestLocation() }
    }
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) { if let l = locations.last { finishPosition(.success(l)) } }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) { finishPosition(.failure(error)) }

    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        guard region.identifier == "home" else { return }
        cancelPending { [self] in
            fireNext()
            let left = min(5, d.integer(forKey: "lf.n") - todayCount())
            if left > 0 { for k in 1...left { scheduleLater(k) } }
        }
    }
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        guard region.identifier == "home" else { return }
        cancelPending { }
    }

    // MARK: reminders
    private func todayKey() -> String { let c = Calendar.current.dateComponents([.year, .month, .day], from: Date()); return String(format: "%04d-%02d-%02d", c.year!, c.month!, c.day!) }
    private func todayCount() -> Int { d.string(forKey: "lf.cntDay") == todayKey() ? d.integer(forKey: "lf.cnt") : 0 }
    private func setCount(_ n: Int) { d.set(todayKey(), forKey: "lf.cntDay"); d.set(max(0, n), forKey: "lf.cnt") }

    private func availableItems() -> [[String: Any]] {
        guard let s = d.string(forKey: "lf.items"), let data = s.data(using: .utf8),
              let arr = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else { return [] }
        return arr.filter { ($0["doneDay"] as? String) != todayKey() }
    }

    private func content(for item: [String: Any]) -> UNMutableNotificationContent {
        let c = UNMutableNotificationContent()
        c.title = item["title"] as? String ?? "Timbre Tamer"
        c.body = item["body"] as? String ?? ""
        c.sound = .default
        c.userInfo = ["route": item["route"] as? String ?? "#today"]
        return c
    }

    private func fireNext() {
        guard todayCount() < d.integer(forKey: "lf.n"), let item = availableItems().randomElement() else { return }
        setCount(todayCount() + 1)
        d.set(item["route"] as? String ?? "#today", forKey: "lf.route"); d.set(Date().timeIntervalSince1970, forKey: "lf.routeAt")
        UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: "leave-now", content: content(for: item), trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)))
    }

    private func scheduleLater(_ k: Int) {
        guard let item = availableItems().randomElement() else { return }
        setCount(todayCount() + 1)
        UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: "leave-\(k)", content: content(for: item), trigger: UNTimeIntervalNotificationTrigger(timeInterval: Double(k) * gapMinutes * 60, repeats: false)))
    }

    /// Coming home cancels the extra reminders that have not rung yet, and gives their share of today's allowance back.
    private func cancelPending(then done: @escaping () -> Void) {
        let center = UNUserNotificationCenter.current()
        center.getPendingNotificationRequests { [self] reqs in
            let ids = reqs.map { $0.identifier }.filter { $0.hasPrefix("leave-") }
            center.removePendingNotificationRequests(withIdentifiers: ids)
            DispatchQueue.main.async { setCount(todayCount() - ids.count); done() }
        }
    }
}

@objc(LeaveFencePlugin)
public class LeaveFencePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LeaveFencePlugin"
    public let jsName = "LeaveFence"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "takeRoute", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "currentPosition", returnType: CAPPluginReturnPromise)
    ]

    @objc func set(_ call: CAPPluginCall) {
        let items = (call.getArray("items") as? [[String: Any]]) ?? []
        LeaveFenceCore.shared.configure(lat: call.getDouble("lat"), lng: call.getDouble("lng"), radius: call.getDouble("radius") ?? 150, n: call.getInt("n") ?? 2, items: items)
        call.resolve()
    }

    @objc func takeRoute(_ call: CAPPluginCall) {
        call.resolve(["route": LeaveFenceCore.shared.takeRoute() as Any])
    }

    @objc func currentPosition(_ call: CAPPluginCall) {
        LeaveFenceCore.shared.currentPosition { r in
            switch r {
            case .success(let l): call.resolve(["latitude": l.coordinate.latitude, "longitude": l.coordinate.longitude])
            case .failure(let e): call.reject(e.localizedDescription)
            }
        }
    }
}
