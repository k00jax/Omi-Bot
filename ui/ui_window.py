
import tkinter as tk

class TranscriptWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Omi-Bot Transcript")
        self.text = tk.Text(self.root, height=10, width=60)
        self.text.pack()
        self.root.after(100, self.update)
        self.lines = []

    def add_line(self, text):
        self.lines.append(text)
        if len(self.lines) > 10:
            self.lines.pop(0)
        self.text.delete(1.0, tk.END)
        self.text.insert(tk.END, "\n".join(self.lines))

    def update(self):
        self.root.after(100, self.update)

    def run(self):
        self.root.mainloop()
