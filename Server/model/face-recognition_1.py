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
import h5py
from numpy import loadtxt
from keras.models import load_model

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)  #suppress warnings of tensorflow 
# Input = Input(shape=(96, 96, 3))
# model = create_model(Input)

# # Load weights from csv files
# weights = utils.weights
# weights_dict = utils.load_weights()

# # Set layer weights of the model
# for name in weights:
    
      
#       if model.get_layer(name) != None:
#             model.get_layer(name).set_weights(weights_dict[name])
#       elif model.get_layer(name) != None:
#             model.get_layer(name).set_weights(weights_dict[name])
model=load_model('m.h5', custom_objects={'tf': tf})
# genrate embeddings of images inside image folder
def image_to_embedding(image, model):
      image = cv2.resize(image, (96, 96))
      img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
      img = np.around(np.transpose(img, (0,1,2))/255.0, decimals=12)
      img_array = np.array([img])
     
      embedding = model.predict_on_batch(img_array)
      return embedding

# calculates similarity between faces
def recognize_face(face_image, embeddings, model):

      face_embedding = image_to_embedding(face_image, model)
      
      min_dist = 150
      Name = None

      # Loop over  names and encodings.
      for (name, embedding) in embeddings.items():

            dist = np.linalg.norm(face_embedding-embedding)

            if dist < min_dist:
                  min_dist = dist
                  Name = name

      if min_dist <= 0.75:
            return str(Name)

      else:
            return "None"

#Recognize images present in Attend_Images Folder
def recognize_faces(embeddings) :
      font = cv2.FONT_HERSHEY_SIMPLEX
      
     
      face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

     
      for img in glob.glob("Attend_Images/*.jpg"):
            cap=cv2.imread(img)
            image=cap
            image = cv2.resize(image,(96,96))
            cap = cv2.resize(cap,(96,96))
            gray_img = cv2.cvtColor(cap, cv2.COLOR_BGR2GRAY)
            
            faces = face_cascade.detectMultiScale(gray_img, 1.2, 5)
            for (x, y, w, h) in faces:

                  face = image[y:y+h, x:x+w]
                  identity = recognize_face(face, embeddings, model)
                  cv2.rectangle(image,(x, y),(x+w, y+h),(0,0,255),2)
            
                  print(identity)
            

# embeddings are loaded from embeddings.npy
def load_embeddings() :
      input_embeddings = {}
      embedding_file = np.load('embeddings.npy',allow_pickle=True)
      for k,v in embedding_file[()].items() :
       #     print(type(v))
            input_embeddings[k] = v
            
      return input_embeddings

embeddings = load_embeddings()

recognize_faces(embeddings)
