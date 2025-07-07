import sys
import os
import pandas as pd
import numpy as np
from dataclasses import dataclass


from  catboost import CatBoostRegressor
from sklearn.metrics import r2_score , mean_squared_error
from sklearn.model_selection import GridSearchCV


from src.bike_sharing_ml.utils.exception import CustomException
from src.bike_sharing_ml.utils.logger import logging
from src.bike_sharing_ml.utils.utils import save_object


@dataclass
class ModelTrainerConfig:
    trained_model_file_path = os.path.join('models', 'trained_model.pkl')


class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def make_model_trainer(self, train_array, test_array):
        try:
            logging.info('data train va test ga ajratildi')
            X_train, y_train, X_test, y_test = (
                train_array[:,:-1],  # all except the last column
                train_array[:,-1], #last column
                test_array[:,:-1],
                test_array[:,-1]
            )

            model = CatBoostRegressor(verbose = 0, train_dir='catboost_info')  # CatBoostRegressor is a gradient boosting library that uses decision trees as base learners
            logging.info('CatBoostRegressor modeli yasaldi')

            params = {'depth': [6,8,10],
                      'learning_rate': [0.01, 0.05, 0.1],
                      'iterations': [30, 50, 100]}
            

            grid = GridSearchCV(estimator=model, 
                                param_grid=params, 
                                cv=3, 
                                scoring='neg_mean_squared_error', 
                                verbose=1, 
                                n_jobs=-1, 
                                error_score='raise')
            
            
            grid.fit(X_train, y_train)
            best_model = grid.best_estimator_
            logging.info(f'Best model parameters: {grid.best_params_}')
            y_pred = best_model.predict(X_test)
            r2 = r2_score(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            logging.info(f'R2 Score: {r2}')
            logging.info(f'Mean Squared Error: {mse}')
            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=best_model
            )
            logging.info('Model saqlandi')
            return r2, mse
        except Exception as e:
            raise CustomException(e, sys) from e



    