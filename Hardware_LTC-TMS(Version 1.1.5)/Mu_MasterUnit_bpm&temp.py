from microbit import *
import radio

radio.on()
radio.config(group=123)

while True:
    temp = temperature()
    display.show(Image.HEART)
    incoming = radio.receive()
    if incoming is not None:
         display.scroll('bpm'+str(incoming)+' ')
         display.scroll('temp'+str(temp)+'C')
    sleep(2000)