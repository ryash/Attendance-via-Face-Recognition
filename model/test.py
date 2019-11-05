import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import sys
import glob
import numpy as np
from numpy import genfromtxt
import pandas as pd
import cv2
from keras.layers import Input
from keras import backend as K
from keras_openface import utils
from keras_openface.utils import LRN2D
from create_embeddings import create_model
import tensorflow as tf   

for img in glob.glob("/home/ryash/Desktop/lap/Attendance-via-Face-Recognition/model/*.jpg"):
            cap=cv2.imread(img)
            #reshape of image can be done here.
            image=cap
            image = cv2.resize(image,(96,96))
            cap = cv2.resize(cap,(96,96))
            gray_img = cv2.cvtColor(cap, cv2.COLOR_BGR2GRAY)
            print(gray_img[0])