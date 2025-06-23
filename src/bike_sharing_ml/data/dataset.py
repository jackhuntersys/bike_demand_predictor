import os
import sys
from ..utils.exception import CustomException
from ..utils.logger import logging
import pandas as pd

from sklearn.model_selection import train_test_split
from dataclasses import dataclass