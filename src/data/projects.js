export const projects = [
  {
    id: "proj-001",
    title: "Smart Urban Mapping",
    domain: "GIS • Remote Sensing • GeoAI",
    facultyMentor: "Dr. Arun Kumar",
    studentTeam: "6 Members",
    status: "Ongoing",
    description: "A student-led initiative exploring intelligent mapping techniques for understanding and analyzing urban environments.",
    overview: "This project aims to create high-resolution digital maps of urban areas to support smart city initiatives and urban planning.",
    problemStatement: "Traditional urban maps lack real-time data and detailed spatial analysis, making it difficult to address dynamic urban challenges efficiently.",
    objectives: [
      "Develop a framework for integrating multiple spatial data sources.",
      "Apply machine learning algorithms to identify urban features.",
      "Create an interactive mapping portal for stakeholders."
    ],
    methodology: "Data collection using satellite imagery and drone surveys, followed by processing in GIS software. AI models will be trained on the data for automated feature extraction.",
    technologies: ["QGIS", "Python", "TensorFlow", "PostGIS"],
    expectedOutcome: "A comprehensive digital twin of the target urban area with real-time analytics capabilities.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "proj-002",
    title: "AI-Based Land Cover Classification",
    domain: "Remote Sensing • Machine Learning",
    facultyMentor: "Dr. Priya Sharma",
    studentTeam: "5 Members",
    status: "Ongoing",
    description: "Utilizing deep learning models to automatically classify land cover types from satellite imagery with high accuracy.",
    overview: "By leveraging the power of AI, this project automates the tedious process of categorizing land use and land cover (LULC) from multispectral imagery.",
    problemStatement: "Manual LULC classification is time-consuming, prone to human error, and difficult to update frequently over large areas.",
    objectives: [
      "Gather a diverse dataset of annotated satellite images.",
      "Train a Convolutional Neural Network (CNN) for image segmentation.",
      "Evaluate model performance against traditional classification methods."
    ],
    methodology: "Acquisition of Sentinel-2 data, preprocessing, creating training samples, training the U-Net model architecture, and conducting accuracy assessment.",
    technologies: ["Google Earth Engine", "PyTorch", "Sentinel-2 Data"],
    expectedOutcome: "An automated pipeline that can generate LULC maps with over 90% accuracy, enabling rapid environmental monitoring.",
    image: "https://images.unsplash.com/photo-1508344928928-7105b67de45b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "proj-003",
    title: "Campus Geospatial Information System",
    domain: "GIS • Web Mapping",
    facultyMentor: "Dr. Rahul Menon",
    studentTeam: "4 Members",
    status: "Ongoing",
    description: "Developing an interactive web-based GIS application to manage and visualize campus infrastructure and resources.",
    overview: "This project provides a centralized platform for the university administration and students to access spatial information about the campus.",
    problemStatement: "Campus spatial data is currently scattered across different departments, making it hard to find specific locations or manage facilities effectively.",
    objectives: [
      "Digitize the entire university campus layout.",
      "Create a database for facilities, classrooms, and utilities.",
      "Develop a user-friendly web interface for navigation and queries."
    ],
    methodology: "Field surveys using GPS devices, database design, server setup, and frontend web development using mapping libraries.",
    technologies: ["React", "Leaflet", "Node.js", "PostgreSQL"],
    expectedOutcome: "A fully functional web map that assists in campus navigation, facility management, and emergency response planning.",
    image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];
