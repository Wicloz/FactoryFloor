from abc import ABC, abstractmethod


class BaseIntegration(ABC):
    KEY = None

    @abstractmethod
    def set_device_info(self, device, configuration):
        pass

    @abstractmethod
    def get_all_device_info(self):
        pass
