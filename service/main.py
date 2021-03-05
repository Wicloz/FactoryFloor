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
        found = []
        for general, specific in value.get_all_device_info():
            general['device'] = specific
            general['provider'] = key
            general['changed'] = False
            database['devices'].update({
                'provider': general['provider'],
                'ikey': general['ikey'],
            }, general, True)
            found.append(general['ikey'])
        database['devices'].remove({
            'provider': key,
            'ikey': {'$nin': found},
        })
