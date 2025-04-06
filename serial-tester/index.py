import serial
import threading

# Ganti COM port sesuai device kamu
PORT = "COM10"
BAUDRATE = 9600

# Setup serial connection
ser = serial.Serial(
    port=PORT,
    baudrate=BAUDRATE,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    timeout=1,
)

# Fungsi untuk mendengarkan respon dari device secara terus-menerus
def listen_serial():
    while True:
        if ser.in_waiting:
            data = ser.readline().decode(errors='ignore').strip()
            if data:
                print(f"[RECEIVED] {data}")

# Mulai thread untuk baca data masuk
threading.Thread(target=listen_serial, daemon=True).start()

# List perintah yang bisa dikirim
commands = {
    "1": "*OUT1ON#",
    "2": "*OUT2ON#",
    "3": "*OUT3ON#",
    "4": "*OUT4ON#",
    "5": "*OUT1OFF#",
    "6": "*OUT2OFF#",
    "7": "*OUT3OFF#",
    "8": "*OUT4OFF#",
    "9": "*OPEN1#",
    "10": "*CLOSE1#",
    "11": "*STOP1#",
    "12": "*OPEN2#",
    "13": "*CLOSE2#",
    "14": "*STOP2#",
    "15": "*PING#",
    "16": "*STAT#",
    "17": "*TRIG1#",
    "18": "*TRIG2#",
    "19": "*TRIG3#",
    "20": "*TRIG4#",
    "99": "EXIT",
}

def show_menu():
    print("\n=== SERIAL COMMAND TESTER ===")
    for key, val in commands.items():
        print(f"{key}. {val}")
    print("================================")

while True:
    show_menu()
    choice = input("Pilih nomor perintah: ").strip()
    
    if choice == "99":
        print("Keluar...")
        break
    elif choice in commands:
        command = commands[choice]
        print(f"[SENDING] {command}")
        ser.write(command.encode())
    else:
        print("Pilihan tidak dikenal!")

ser.close()
