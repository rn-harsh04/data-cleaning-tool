from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def convert_stats(stats):
    """Convert numpy types in stats to native Python types"""
    return {
        "missing_values": {k: int(v) for k, v in stats["missing_values"].items()},
        "duplicates": int(stats["duplicates"]),
        "shape": [int(x) for x in stats["shape"]],
        "dtypes": {k: str(v) for k, v in stats["dtypes"].items()}
    }

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads and preprocess data"""
    try:
        # Start timing
        start_time = time.time()
        
        # Read file with timing
        read_start = time.time()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO((await file.read()).decode('utf-8')))
        elif file.filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(await file.read()))
        read_time = (time.time() - read_start) * 1000  # milliseconds

        # Store original stats
        original_stats = {
            "missing_values": df.isnull().sum(),
            "duplicates": df.duplicated().sum(),
            "shape": df.shape,
            "dtypes": df.dtypes
        }

        # Process data with timing
        process_start = time.time()
        df = preprocess_data(df)
        process_time = (time.time() - process_start) * 1000  # milliseconds

        # Store cleaned stats
        cleaned_stats = {
            "missing_values": df.isnull().sum(),
            "duplicates": df.duplicated().sum(),
            "shape": df.shape,
            "dtypes": df.dtypes
        }

        # Convert to CSV
        output = io.StringIO()
        df.to_csv(output, index=False)
        
        return {
            "message": "File processed successfully!",
            "data": output.getvalue(),
            "stats": {
                "original": convert_stats(original_stats),
                "cleaned": convert_stats(cleaned_stats),
                "performance": {
                    "read_time": round(read_time, 2),
                    "process_time": round(process_time, 2),
                    "total_time": round((time.time() - start_time) * 1000, 2)
                }
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """Enhanced dataset preprocessing"""
    df = df.copy()
    
    # Remove duplicates
    df.drop_duplicates(inplace=True)
    
    # Handle missing values by dtype
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].fillna('').str.lower()
        elif np.issubdtype(df[col].dtype, np.number):
            df[col] = df[col].fillna(df[col].median())
        else:
            df[col] = df[col].fillna(method='ffill')
    
    return df