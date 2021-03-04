from integrations.base import BaseIntegration
import requests


class PhilipsHue(BaseIntegration):
    KEY = 'hue'

    def __init__(self, ip, key):
        self.base = 'http://' + ip + '/api/' + key + '/'

    def set_device_info(self, device, configuration):
        pass

    def get_all_device_info(self):
        for key, light in requests.get(self.base + 'lights').json().items():
            general = {
                'ikey': f'lights/{key}',
                'connected': light['state']['reachable'],
                'name': light['name'],
                'type': 'light',
            }
            specific = {
                'on': light['state']['on'],
                'brightness': light['state']['bri'] / 255,
            }
            yield general, specific

        for key, sensor in requests.get(self.base + 'sensors').json().items():
            if sensor['type'] in (
                    'Daylight', 'CLIPGenericFlag', 'Geofence', 'CLIPGenericStatus', 'CLIPPresence', 'ZLLSwitch'
            ):
                continue

            general = {
                'ikey': f'sensors/{key}',
                'connected': sensor['config']['reachable'],
                'name': sensor['name'],
                'type': 'sensor',
            }

            if 'temperature' in sensor['state']:
                sensor['state']['temperature'] /= 100
            if 'lightlevel' in sensor['state']:
                sensor['state']['lightlevel'] = 10 ** ((sensor['state']['lightlevel'] - 1) / 10000)

            del sensor['state']['lastupdated']
            yield general, sensor['state']
