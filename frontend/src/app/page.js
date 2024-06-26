"use client"
import React, { useState } from 'react';

export default function Home() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileName1, setFileName1] = useState(""); // State to store the name of the first file
  const [fileName2, setFileName2] = useState(""); // State to store the name of the second file
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
    setFileName1(e.target.files[0].name);
     // Set the name of the first file

  };
 
  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
    setFileName2(e.target.files[0].name); // Set the name of the second file

  };

  // const fileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result.split(',')[1]); // Get the base64 part
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const downloadFile = async () => {
    try {
      let response = await fetch("http://localhost:8000/api/v1/download", {
        method: "GET",
        headers: {
          "Accept": "text/csv"
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'allocations.csv';  // Name of the file to be downloaded
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDisplayText("Hostel allocated and \n Allocation file downloaded successfully");
        setLoading(false); // Stop loading on error
        setTimeout(() => {
          setDisplayText(""); // Clear the display text after 2 seconds
        }, 2000);
        resetForm();
        setLoading(false); // Stop loading after download
      } else {
        // setDisplayText("Download failed. Please try again.");
        // setLoading(false); // Stop loading on error
        // setTimeout(() => {
        //   setDisplayText(""); // Clear the display text after 2 seconds
        // }, 2000);
      }
    } catch (error) {
      console.error('Download error:', error);
      // setDisplayText("Download failed. Please try again.");
      // setLoading(false); // Stop loading on error
      // setTimeout(() => {
      //   setDisplayText(""); // Clear the display text after 2 seconds
      // }, 2000);
    }
  };

  const onSubmit = async () => {
    if (!file1 || !file2) {
      setDisplayText("Please select both files before submitting.");
      setTimeout(() => {
        setDisplayText("");
      }, 2000);
      return;
    }

    const formData = new FormData();
    formData.append('groupCSV', file1); // Append first file with its name
    formData.append('hostelCSV', file2); // Append second file with its name
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }
   var options = { content: formData };

  // const groupCSV= file1
  // const hostelCSV=file2
  // const options={
  //   groupCSV, hostelCSV
  // }

    try {
      setLoading(true); // Start loading animation

      // const base64File1 = await fileToBase64(file1);
      // const base64File2 = await fileToBase64(file2);

      // const payload = {
      //   groupCSV: base64File1,
      //   hostelCSV: base64File2
      // };

      // let r = await fetch("http://localhost:8000/api/v1/upload", {
      //   method: "POST",
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // });

      let r = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        body: formData
      });

      // let res = await r.text();
      // console.log(options, res);

      if (r.ok) {
        setDisplayText("Uploaded successfully! Starting download...");
        setTimeout(() => {
          setDisplayText(""); // Clear the display text after 2 seconds
        }, 2000);

        // Trigger the download
        downloadFile();
      } else {
        setDisplayText("Submission failed. Please try again.");
        setLoading(false); // Stop loading on error
        setTimeout(() => {
          setDisplayText(""); // Clear the display text after 2 seconds
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setDisplayText("Submission failed. Please try again.");
      setLoading(false); // Stop loading on error
      setTimeout(() => {
        setDisplayText(""); // Clear the display text after 2 seconds
      }, 2000);
    }
  };

  return (
    <div>
      <h1 className="text-white font-bold text-5xl text-center pt-20">ACCOMODATION</h1>
      <p className="text-gray-300 text-center pt-2">Books Your Home Away from Home for Techfest Adventures</p>

      <h2 className="text-white font-bold text-3xl text-center pt-20">Upload your CSV files here</h2>

      <div className="text-center pt-5">
        <h3 className="text-white font-bold text-xl pt-5">Upload Group CSV file</h3>
        <input 
          className="mt-2 ml-60" 
          type="file" 
          name='groupCSV'
          onChange={handleFile1Change} 
        />
        {fileName1 && <p className="text-gray-400 mt-2">{fileName1}</p>} {/* Display the first file name */}
      </div>

      <div className="text-center pt-10">
        <h3 className="text-white font-bold text-xl pt-5">Upload Hostel CSV file</h3>
        <input 
          className="mt-2 ml-60" 
          type="file" 
          name='hostelCSV'
          onChange={handleFile2Change} 
        />
        {fileName2 && <p className="text-gray-400 mt-2">{fileName2}</p>} {/* Display the second file name */}
      </div>

      <div className="text-center pt-10">
        <button 
          className="mt-2 text-white bg-blue-500 px-4 py-2 rounded" 
          onClick={onSubmit}
        >
          Submit Both CSVs and Download
        </button>
      </div>

      {loading && (
        <div role="status" className="flex justify-center items-center mt-4">
          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.471" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {displayText && (
        <p className="text-white text-center pt-5">{displayText}</p>
      )}
    </div>
  );
}
