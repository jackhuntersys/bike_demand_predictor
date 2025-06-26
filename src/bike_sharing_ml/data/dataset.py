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
    raise CustomException(e, sys)


@dataclass
class DataIngestionConfig:
    """
    Data Ingestion Configuration Class
    """
    train_data_path: str = os.path.join('data/raw', 'train.csv')
    test_data_path: str = os.path.join('data/raw', 'test.csv')
    raw_data_path: str = os.path.join('data/raw', 'raw.csv')


#TODO SHu yerda DataIngestionConfig ni ishlatib, train va test datasetlarni tayyorlash kerak