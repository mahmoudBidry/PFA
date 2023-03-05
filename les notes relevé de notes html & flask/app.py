from flask import Flask, render_template, request, make_response
import pdfkit

app = Flask(__name__)

# python app.py for running the project

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate_transcript", methods=["POST"])
def generate_transcript():

    config = pdfkit.configuration(wkhtmltopdf="C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")

    # Get the module grades from the form data
    module1 = int(request.form["module1"])
    module2 = int(request.form["module2"])
    module3 = int(request.form["module3"])

    # Calculate the total and average grades
    total = module1 + module2 + module3
    average = total / 3.0

    # Generate the transcript as HTML
    html = render_template("transcript.html", module1=module1, module2=module2, module3=module3, total=total, average=average)

    # # Convert the HTML to PDF using pdfkit
    pdf = pdfkit.from_string(html, "PDFs/pdf.pdf", configuration = config)
    # # Create a response with the PDF file
    # response = make_response(pdf)
    # response.headers["Content-Type"] = "application/pdf"
    # response.headers["Content-Disposition"] = "attachment; filename=transcript.pdf"


    return "pdf created succesfully"

if __name__ == "__main__":
    app.run(debug=True)
