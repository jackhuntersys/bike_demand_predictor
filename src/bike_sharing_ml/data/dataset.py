import os
import sys
from src.bike_sharing_ml.utils.exception import CustomException
from src.bike_sharing_ml.utils.logger import logging
import pandas as pd

from sklearn.model_selection import train_test_split
from dataclasses import dataclass

try: 
    df = pd.read_csv(r'D:\2025 lessons\AI+ML course amaliyot\Datasets\seoul_bike_sharing_demand\SeoulBikeData.csv', encoding='cp949')
except Exception as e:
    raise CustomException(e, sys.exc_info()[2])


@dataclass
class DataIngestionConfig:
    """
    Data Ingestion Configuration Class
    """
    train_data_path: str = os.path.join('database/raw', 'train.csv') # data ingestion will save the data in this location with that file name
    test_data_path: str = os.path.join('database/raw', 'test.csv')
    raw_data_path: str = os.path.join('database/raw', 'raw.csv')


class DataIngestion:
    def __init__(self):
        self.ingestion_config = DataIngestionConfig() # this will call the above config class and save all path variables as objects
    
    def initiate_data_ingestion(self):
        logging.info("Data Ingestion started")
        try:
            df = pd.read_csv(r'D:\2025 lessons\AI+ML course amaliyot\Datasets\seoul_bike_sharing_demand\SeoulBikeData.csv', encoding ='cp949')  # you cna also read from any other locations, databases etc.
            logging.info("dataset  dataframe sifatida chaqirildi")

            os.makedirs(os.path.dirname(self.ingestion_config.train_data_path), exist_ok=True)

            df.to_csv(self.ingestion_config.raw_data_path, index=False, header=True)
            
            logging.info("Train test split ga tayyorlanmoqda")
            train_Set, test_Set = train_test_split(df, test_size=0.2, random_state=42)

            train_Set.to_csv(self.ingestion_config.train_data_path, index = False, header = True)
            test_Set.to_csv(self.ingestion_config.test_data_path, index = False, header = True)

            logging.info("Data Ingestion completed")

            return(
                self.ingestion_config.train_data_path,
                self.ingestion_config.test_data_path
            )
        except Exception as e:
            raise CustomException (e, sys.exc_info()[2])
        
if __name__=="__main__":
    obj = DataIngestion()
    train_data, test_data = obj.initiate_data_ingestion()

    # data_transformation = DataTransformation()
    # train_array, test_array, _ = data_transformation.initiate_data_transformation(train_data, test_data)

    # model_trainer = ModelTrainer()
    # print(model_trainer.initiate_model_trainer(train_array, test_array))