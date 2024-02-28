import sys
import cv2
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QLabel
from PyQt5.QtCore import Qt, QTimer
from noddingpigeon.inference import predict_video

class QuestionApp(QWidget):
    def __init__(self):
        super().__init__()
        self.question = "Do you agree with the statement?"
        self.is_recording = False
        self.initUI()
    
    def initUI(self):
        self.setWindowTitle('Question Recording')
        self.setGeometry(100, 100, 400, 200)
        
        self.question_label = QLabel(self.question, self)
        self.question_label.setAlignment(Qt.AlignCenter)

        self.result_label = QLabel("", self)
        self.result_label.setAlignment(Qt.AlignCenter)

        self.record_button = QPushButton("Record", self)
        self.record_button.clicked.connect(self.record_frames)

        layout = QVBoxLayout()
        layout.addWidget(self.question_label)
        layout.addWidget(self.result_label)
        layout.addWidget(self.record_button)
        self.setLayout(layout)

    def record_frames(self):
        result = predict_video()
        self.update_result(result)

    def update_result(self, result):
        if result["gesture"] == "nodding":
            self.result_label.setText("You agree with the statement")
        elif result["gesture"] == "turning":
            self.result_label.setText("You disagree with the statement")
        elif result["gesture"] == "stationary":
            self.result_label.setText("You are neutral")
        else:
            self.result_label.setText("No gesture detected")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = QuestionApp()
    window.show()
    sys.exit(app.exec_())
