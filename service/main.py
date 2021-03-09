from integrations.hue import PhilipsHue
from yaml import safe_load
from pymongo import MongoClient, ASCENDING


def yaml(path):
    with open(path, 'rb') as fp:
        return safe_load(fp)


if __name__ == '__main__':
    integrations = {}
    for cls in [PhilipsHue]:
        integrations[cls.KEY] = cls(**yaml(f'configuration/{cls.KEY}.yaml'))

    database = MongoClient()['house']
    database['devices'].create_index(keys=[('provider', ASCENDING), ('ikey', ASCENDING)], unique=True)
    database['devices'].create_index(keys='changed')

    for key, value in integrations.items():
        devices = list(value.list_all_devices())

        for device in devices:
            general, specific = value.get_device_info(device)
            general['ikey'] = device
            general['provider'] = key
            general['state'] = specific
            general['changed'] = False

            database['devices'].update_one({
                'provider': general['provider'],
                'ikey': general['ikey'],
            }, {'$set': general}, True)
        database['devices'].delete_many({
            'provider': key,
            'ikey': {'$nin': devices},
        })
