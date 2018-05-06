
#include <RunningMedian.h>


#include <DistanceGP2Y0A21YK.h>


#include <Wire.h>


// distance sensor
DistanceGP2Y0A21YK distanceSensor;

// distance is calculated on a running median using the last 8 values
RunningMedian distanceMedian = RunningMedian(8);


// input voltage area from which a person is considered in front of the mirror
// full input voltage area 0-1023, output voltage curve:
// https://cdn.sparkfun.com//assets/parts/1/8/4/IRSensor-3.jpg

// the higher the value (voltage), the closer one is to the mirror

// standing in front / in use: from about 60cm to 5cm
int inUseThreshold = 100; // 100/1023 * 5V = 0.5 => (less than 5cm or) less than 60cm
// away / idle: more than about 80cm away
int awayThreshold = 80; // 80/1023 * 5V = 0.4V => (less than 2cm or) more than 80cm


// mirror in use
boolean inUse = false;

//count to ensure people are away
int countAway = 0;

void setup() {

  Serial.begin(9600);

  distanceSensor.begin(A0);
  int initDistance = distanceSensor.getDistanceRaw();

}

void loop() {
  // put your main code here, to run repeatedly:

  // enable sensor if in front of the mirror (distance > 100)
  if (!inUse && distanceMedian.getMedian() > inUseThreshold) {

    activateReportMirrorUse();

  }
  // disable sensor if nobody is on front of mirror (distance < 80)
  else if (inUse && distanceMedian.getMedian() < awayThreshold) {

    disableandReportMirrorIdle();

  }
  // get distance from distance sensor
  // range 0-1023
  int distanceRaw = distanceSensor.getDistanceRaw();

  // only consider running median of last 8 values
  distanceMedian.add(distanceRaw);

}
void activateReportMirrorUse() {

  countAway = 0;
  inUse = true;
  Serial.println(1);
}
void disableandReportMirrorIdle() {

  countAway++;

  if (countAway > 100) {

    inUse = false;
    Serial.println(0);

  }

}
