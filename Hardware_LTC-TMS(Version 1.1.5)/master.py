from microbit import *
import radio

radio.on()
radio.config(group=123)

while True:
    display.show(Image.HEART)
    incoming = radio.receive()
    if incoming is not None:
         display.show(incoming)
    sleep(2000)
