import io
from pydub import AudioSegment
from pedalboard import Pedalboard, load_plugin
from pedalboard.io import AudioFile
from firebase_functions import https_fn
# from firebase_admin import initialize_app


def apply_effects(request_file: bytes, is_preview):
    audio_data = io.BytesIO(request_file.read())
    audio_file = AudioSegment.from_file(audio_data, format='mp3')
    if is_preview:
        audio_file = audio_file[:30000]

    input_audio_data = io.BytesIO()
    audio_file.export(input_audio_data, format="mp3")
    input_audio_data.seek(0)

    with AudioFile(input_audio_data, 'r') as f:
        audio = f.read(f.frames)
        samplerate = f.samplerate
        num_channels = f.num_channels

    plugin = load_plugin("libs/audio-distortion.vst3")
    plugin.tooth = -28
    plugin.aether = 828
    pedalboard = Pedalboard([plugin])

    effected = pedalboard(audio, samplerate)

    output_audio_data = io.BytesIO()
    with AudioFile(output_audio_data, "w", samplerate, num_channels=num_channels, format="mp3") as f:
        f.write(effected)
    output_audio_data.seek(0)
    return output_audio_data


def file_checks(request_file):
    if not request_file:
        return https_fn.Response("No file part", status=400)

    if request_file.content_type != 'audio/mpeg':
        return https_fn.Response("Invalid file type", status=400)

    if request_file.content_length > 10 * 1024 * 1024:
        return https_fn.Response("File too large", status=400)


@https_fn.on_request()
def spookmeup(req: https_fn.Request) -> https_fn.Response:
    try:
        request_file = req.files.get('file')
        file_checks(request_file)

        output_audio_data = apply_effects(request_file, True)
        response = output_audio_data.read()

        return https_fn.Response(response, status=200, content_type='audio/mpeg')

    except Exception as e:
        print(e)
        return https_fn.Response("Error processing audio", status=500)


@https_fn.on_request()
def upload(req: https_fn.Request) -> https_fn.Response:
    try:
        request_file = req.files.get('file')
        file_checks(request_file)

        output_audio_data = apply_effects(request_file, False)
        response = output_audio_data.read()

        return https_fn.Response(response, status=200, content_type='audio/mpeg')

    except Exception as e:
        print(e)
        return https_fn.Response("Error processing audio", status=500)
