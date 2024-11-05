from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden

# import numpy as np
# from .apps import ApiConfig # ML Model configuration


def home(request):
    return render(request, 'home.html')


def profile(request):
    return HttpResponse("Work In Progress!")


def games(request):
    return HttpResponse("Work In Progress!")


def practice(request):
    return HttpResponse("Work In Progress!")


def temp(request):
    return render(request, 'main.html')


def webcam_prediction(request):
    return render(request, 'webcamPrediction.html')


def learn(request):
    return render(request, 'learn.html')


def beginner(request):
    return render(request, 'beginner.html')


def letters(request):
    if request.method == 'POST':
        ltr = request.POST.get('letter', None)
        ctx = {'letter': ltr}
        return render(request, 'letters.html', ctx)

    return HttpResponseForbidden("403 Forbidden")


# def get_prediction(request):
# Server-side ML Model functionality (also uncomment in apps.py and urls.py)
#     is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
#
#     if is_ajax:
#         if request.method == 'POST':
#             if 'sequence[0][]' in request.POST:
#                 seq = []
#                 for i in range(0, 10):
#                     seq.append(request.POST.getlist("sequence[" + str(i) + "][]"))
#                 tensor = np.array(seq)
#                 tensor = tensor.astype(np.float64)
#                 tensor = np.expand_dims(tensor, axis=0)
#
#                 model = ApiConfig.model
#                 res = model.predict(tensor)[0]
#                 res = letters[np.argmax(res)]
#
#                 return HttpResponse(res)
#             else:
#                 return HttpResponse("Sequence not found")
#         else:
#             return HttpResponseBadRequest("Request method not POST")
#     else:
#         return HttpResponseBadRequest("Request method not valid")
#
# # Global Variables:
# letters = np.array(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm',
#                     'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'])
