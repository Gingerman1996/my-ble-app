const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let device, server, characteristic;

async function connectToESP32() {
    try {
        console.log("Requesting Bluetooth Device...");
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        console.log("Connecting to GATT Server...");
        server = await device.gatt.connect();

        console.log("Getting Service...");
        let service = await server.getPrimaryService(SERVICE_UUID);

        console.log("Getting Characteristic...");
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        document.getElementById("status").innerText = "Connected";
        console.log("Connected to ESP32!");
    } catch (error) {
        console.log("Error:", error);
        document.getElementById("status").innerText = "Connection Failed";
    }
}

async function sendData(value) {
    if (!characteristic) {
        console.log("BLE Not Connected");
        return;
    }

    let encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(value));
    console.log(`Sent: ${value}`);
}

// Event Listeners for buttons
document.getElementById("connectBtn").addEventListener("click", connectToESP32);
document.getElementById("ledOnBtn").addEventListener("click", () => sendData("1"));
document.getElementById("ledOffBtn").addEventListener("click", () => sendData("0"));
