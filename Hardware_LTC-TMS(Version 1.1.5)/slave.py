# Platform: BBC micro:bit
# Language: MicroPython
# Category: BBC micro:bit > Input sensors > Pulsesensors.com
# Purpose : Signal plotting + BPM calculation inc. moving average.
# - Beat detection uses fixed on/off thresholds (vs self-calculated from signal).
# Dependencies:
# - For full function requires Mu editor with REPL and Plotter features.
# Author  : MCU HardWare Team

from microbit import *
#send radio
import radio
radio.on()
radio.config(group =123)
# Define any functions:
def log_microbit(message, message_delay=130):
    # message_delay - how many ms to display message for (larger means longer)
    display.scroll(message, delay=message_delay, wait=True, loop=False, monospace=False)

def log_REPL(message):
    print(message)

def summary():
    return "BPM last {}, average {}.step{}".format(bpm, bpm_avg,step)



# Configure constants and variables before main loop:
# Timing settings
SECONDS_PER_MINUTE = 60
MILLISECONDS_PER_SECOND = 1000
MILLISECONDS_PER_MINUTE = SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
paient_id=550001
fallSatus=0
callStatus=0

# Sampling rate & interval settings (ms)
# Caution:
# Sending output too frequently may exceed bandwidth per second ...
# - we can send through REPL between micro:bit and PC/host device.
# - Effect may show as backlog/lag/staggering in REPL output or Plotter graph.
SAMPLING_RATE = 25  # (Hz) typically 25-100 samples per second
SAMPLING_INTERVAL = int(MILLISECONDS_PER_SECOND / SAMPLING_RATE)

# Detect pulse on/off:
# Beat detection: Use fixed on/off thresholds (vs self-calculated from signal)
# - tracks beat wave starting/end using threshold on/off levels vs signal
# - modify thresholds to see what happens with different people :)
threshold_on = 550
threshold_off = 500
beat = False
#FBConn = firebase.FirebaseApplication('https://mcultc4.firebaseio.com/', None)

# BPM (beats per minute) calculation using moving average buffer.
bpm = 0
bpm_avg = 0
# used buffer to calculate average BPM over buffer's values
beats_buffer = []
BEATS_BUFFER_SIZE = 15

# calculate BPM using counts and times of samples_between_beats
# count how many samples occur between beats.
samples_between_beats = 0
# track time between start and end of a single beat.
current_time = running_time()
start_time = current_time
step= 0
# Sampling loop:
while True:
    sleep(1000)#add to send radio
    current_running_time = running_time()#function send radio
    gesture = accelerometer.current_gesture()
    if gesture == "3g":
        step+= 1

    if gesture == "freefall":
        fallSatus=1

    # read signal from input in pin 2 (currently PulseSensor.com)
    # Signal: Original = 0-1000.
    Signal = pin2.read_analog()

    # increment count of samples_between_beats
    samples_between_beats += 1

    # display pulse on microbit using images:
    # in pulse wave peak ?
    if beat is False and (Signal > threshold_on):
        beat = True
        display.show(Image.HEART)
        # display.set_pixel(2, 2, 9)  # LED pixel on

    # not in pulse wave peak ?
    if beat is True and (Signal < threshold_off):
        beat = False
        display.show(Image.HEART_SMALL)
        # display.clear()
        # display.set_pixel(2, 2, 0)  # LED pixel off

        # calculate latest BPM (beats per minute):
        # BPM = (ms in one minute / time passed since last beat)
        bpm = MILLISECONDS_PER_MINUTE // (running_time() - start_time)

        # append latest BPM to end of buffer
        beats_buffer.append(bpm)
        # ensure buffer only contains tail of maximum size elements.
        if len(beats_buffer) > BEATS_BUFFER_SIZE:
            beats_buffer = beats_buffer[-BEATS_BUFFER_SIZE:]

        # calculate moving average of bpm = sum(bpm's) // count(bpm's)
        bpm_avg = sum(beats_buffer) // len(beats_buffer)

        # reset count of samples and time between beats
        samples_between_beats = 0
        start_time = running_time()

    # Events - Buttons:
    # if button_a pressed, display on microbit BPM summary,
    if button_a.is_pressed():
        message = summary()
        log_microbit(message, 90)
    if button_b.is_pressed():
        callStatus = 1
        print("calling,{}".format(paient_id))
        radio.send("calling {}".format(paient_id))



    # output signal value to REPL
    # Scaling: x2 then subtract 1000 to use full y-range of Plotter graph.
    Signal = 2*Signal - 1000
    # print("({})".format(Signal))
    # print("({}, {}, {})".format(samples_between_beats*10, Signal, bpm*10))
    print("({},{},{},{},{})".format(Signal,paient_id,callStatus,fallSatus,step))
    # if button b pressed, exit forever loop
    #else:
        #send_mess=Signal
    radio.send("{},{},{},{},{}".format(Signal,paient_id,callStatus,fallSatus,step))
    callStatus = 0
    fallSatus  = 0
    
    # pause between samples
    sleep(SAMPLING_INTERVAL)
 
# quitting program
message = "Exit: " + summary()
log_REPL(message)
log_microbit(message, 60)
