from integrations.base import BaseIntegration
import requests


class PhilipsHue(BaseIntegration):
    KEY = 'hue'

    def __init__(self, ip, key):
        self.base = 'http://' + ip + '/api/' + key + '/'

    def set_device_info(self, device, state):
        pass

    def get_device_info(self, ikey):
        device = requests.get(self.base + ikey).json()
        mode = ikey.split('/')[0]

        if mode == 'lights':
            general = {
                'connected': device['state']['reachable'],
                'name': device['name'],
                'type': 'light',
            }
            specific = {
                'on': device['state']['on'],
                'brightness': device['state']['bri'] / 255,
            }
            return general, specific

        if mode == 'sensors':
            general = {
                'connected': device['config']['reachable'],
                'name': device['name'],
                'type': 'sensor',
            }
            specific = device['state']

            del specific['lastupdated']

            if 'temperature' in specific:
                specific['temperature'] /= 100
            if 'lightlevel' in specific:
                specific['lightlevel'] = 10 ** ((specific['lightlevel'] - 1) / 10000)

            return general, specific

    def list_all_devices(self):
        for key in requests.get(self.base + 'lights').json().keys():
            yield f'lights/{key}'

        for key, sensor in requests.get(self.base + 'sensors').json().items():
            if sensor['type'] not in (
                    'Daylight', 'CLIPGenericFlag', 'Geofence', 'CLIPGenericStatus', 'CLIPPresence', 'ZLLSwitch'
            ):
                yield f'sensors/{key}'
