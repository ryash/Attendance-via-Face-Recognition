import os
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

Input = Input(shape=(96, 96, 3))
model = create_model(Input)

# Load weights from csv files
weights = utils.weights
weights_dict = utils.load_weights()

# Set layer weights of the model
for name in weights:
      print("[+] Setting weights........... ")
      
      if model.get_layer(name) != None:
            model.get_layer(name).set_weights(weights_dict[name])
      elif model.get_layer(name) != None:
            model.get_layer(name).set_weights(weights_dict[name])

# genrate embeddings of images inside image folder
def image_to_embedding(image, model):
      image = cv2.resize(image, (96, 96))
      img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
      img = np.around(np.transpose(img, (0,1,2))/255.0, decimals=12)
      img_array = np.array([img])
      print ("as")
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
            print('Euclidean distance from %s is %s' %(name, dist))

            if dist < min_dist:
                  min_dist = dist
                  Name = name

      if min_dist <= 0.75:
            return str(Name)

      else:
            return None


def recognize_faces(embeddings) :
      font = cv2.FONT_HERSHEY_SIMPLEX
      
      cap = cv2.VideoCapture(-1)
      
      fourcc = cv2.VideoWriter_fourcc('m','p','4','v')
      out = cv2.VideoWriter('face-recognition-cnn.avi',fourcc,10,(int(cap.get(3)),int(cap.get(4))),True)

      face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

      while True :

            ret, image = cap.read()
            
            height, width = image.shape[0], image.shape[1]

            gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            faces = face_cascade.detectMultiScale(gray_img, 1.2, 5)

            # Loop through all the faces detected
            for (x, y, w, h) in faces:

                  face = image[y:y+h, x:x+w]
                  identity = recognize_face(face, embeddings, model)
                  cv2.rectangle(image,(x, y),(x+w, y+h),(0,0,255),2)

                  if identity is not None:
                        cv2.rectangle(image,(x, y),(x+w, y+h),(100,150,150),2)
                        cv2.putText(image, str(identity).title(), (x+5,y-5), font, 1, (150,100,150), 2)
        

            cv2.imshow("Face Recognizer", image)
            out.write(image)
            if cv2.waitKey(100) & 0xFF == ord('q') : # exit on q
                  break
      cap.release()
      cv2.destroyAllWindows()



def load_embeddings() :
      input_embeddings = {}
      embedding_file = np.load('embeddings.npy',allow_pickle=True)
      for k,v in embedding_file[()].items() :
            print(type(v))
            input_embeddings[k] = v
            
      return input_embeddings

embeddings = load_embeddings()
print(embeddings)
recognize_faces(embeddings)
