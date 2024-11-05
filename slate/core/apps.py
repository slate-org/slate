from django.apps import AppConfig

# Uncomment for server-side ML Capability
# import os
# import tensorflow
# from django.conf import settings


# Server-side ML Model capability (Uncomment in settings.py and views.py)
# class ApiConfig(AppConfig):
#     name = 'api'
#     MODEL_FILE = os.path.join(settings.MODELS, 'asl.keras')
#     model = tensorflow.keras.models.load_model(MODEL_FILE)


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
