from abc import ABC, abstractmethod


class BaseIntegration(ABC):
    KEY = None

    @abstractmethod
    def set_device_info(self, device, state):
        pass

    @abstractmethod
    def get_device_info(self, ikey):
        pass

    @abstractmethod
    def list_all_devices(self):
        pass
