import numpy as np
import cv2
import pillow_heif

import glob
import os

path = r'public/images/art/*.HEIC'
files = glob.glob(path)
for file in files:
    try:
        heif_file = pillow_heif.open_heif(file, convert_hdr_to_8bit=False)
        # heif_file.convert_to("BGRA;16" if heif_file.has_alpha else "BGR;16")
        np_array = np.asarray(heif_file)
        cv2.imwrite(file[:-4]+'jpg', np_array)
    except:
        os.rename(file, file[:-4]+'jpg')
