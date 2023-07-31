import numpy as np
import cv2
import pillow_heif

import glob
import os

path = r'C:\Users\Ray\Downloads\Photos-mooses\*.HEIC'
files = glob.glob(path)
for file in files:
    try:
        heif_file = pillow_heif.open_heif(file, convert_hdr_to_8bit=False)
        np_array = np.asarray(heif_file)
        
        # Convert color space to RGB
        np_array_rgb = cv2.cvtColor(np_array, cv2.COLOR_BGR2RGB)
        
        cv2.imwrite(file[:-4]+'jpg', np_array_rgb)
    except:
        os.rename(file, file[:-4]+'jpg')