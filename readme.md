# Virtuesense

Virtuesense is a web application that presents users with thought-provoking questions and records their responses through video gestures. It analyzes the gestures and provides feedback based on the user's response.

## Features

- Displays thought-provoking questions from a question bank.
- Records user's responses through video gestures.
- Analyzes gestures to determine the user's response.
- Provides feedback based on the user's gesture (agree, disagree, or neutral).
- Allows users to rerecord their responses or move to the next question.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Video Recording:** RecordRTC
- **Gesture Analysis:** Python with noddingpigeon
- **Deployment:** Docker (optional)

## Prerequisites

- Node.js installed on your machine
- Python installed on your machine (for gesture analysis)

## Setup Instructions

1. Clone the repository:


2. Install dependencies for both frontend and backend:

    ```bash
    cd my-app
    npm install
    cd ../python_backend
    pip install -r requirements.txt
    ```

3. Start the frontend and backend servers:

    ```bash
    cd my-app/src
    node server.js
    ```
 
4. In a separate terminal, start the React application:

    ```bash
    cd my-app
    npm start
    ```

5. Open your browser and navigate to http://localhost:3000 to access the application.

## Usage

- Answer the thought-provoking questions by nodding or shaking your head.
- Press the "Start Recording" button to begin recording your response.
- Press the "Stop Recording" button once you've finished gesturing.
- The application will analyze your gesture and provide feedback.
- You can choose to rerecord your response or move to the next question.

## Design Choices:

- **Frontend:** The frontend is built using React.js. It uses RecordRTC to record the user's gestures and sends the video data to the backend for analysis. The frontend also displays the questions and feedback to the user.

- **Backend:** The backend is built using Node.js with Express. It receives the video data from the frontend and sends it to the Python backend for analysis. It also serves the frontend and handles the communication between the frontend and the Python backend.    

- **Gesture Analysis:** The gesture analysis is done using Python with noddingpigeon. Noddingpigeon is a Python library that uses OpenCV to analyze the user's gestures and determine their response to the question. The reason for this choice was that other models are very expensive and require a lot of data to train. Noddingpigeon is a lightweight and easy-to-use library that provides accurate results. Especially because the task is relatively simple and doesn't require a lot of data to train.


## Problems Encountered

- **Slow response time** : Currently the noddingpigeon only accepts mp4 files so the webm files have to be converted to mp4 before being sent to the backend. This conversion process takes a lot of time and slows down the response time. This can be improved by using a different library that accepts webm files or by using a different method to convert the files.

- **Accuracy of gesture analysis** : The accuracy of the gesture analysis is not perfect. It can be improved by training the model with more data and by using a more sophisticated model. However, this would require a lot of time and resources which are not available at the moment.

- **Deployment** : The application is currently not deployed. It can be deployed using Docker to make it easier to run on different machines.

## Docker Deployment
- I've pushed a template Dockerfile to the repository. You can use it to deploy the application using Docker.

```bash
docker build -t my-app-image .
docker run -p 2000:2000 my-app-image
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your suggestions or improvements.






