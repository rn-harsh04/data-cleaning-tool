from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import io

app = FastAPI()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO((await file.read()).decode('utf-8')))
        elif file.filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(await file.read()))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Upload a CSV or JSON file.")

        # Preprocessing
        df = preprocess_data(df)

        # Convert processed dataframe to CSV
        output = io.StringIO()
        df.to_csv(output, index=False)
        return {"message": "File processed successfully!", "data": output.getvalue()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic dataset preprocessing"""
    df.drop_duplicates(inplace=True)  # Remove duplicates
    df.fillna(method='ffill', inplace=True)  # Fill missing values using forward fill
    df = df.apply(lambda x: x.str.lower() if x.dtype == "object" else x)  # Convert strings to lowercase
    return df
