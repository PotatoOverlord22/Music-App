Adaptive Music Equalization Using User Context and Genre Classification
Bachelor's Thesis Project – Babeș-Bolyai University, 2025

Developed a full-stack AI-powered music enhancement system that dynamically adjusts audio equalization based on genre and user context. Engineered a modular architecture comprising:

Audio Analysis Pipeline in Python using Librosa for MFCC extraction, beat tracking, tempo, valence, and energy metrics.

Genre Classification using a custom CNN (CONEqNet) trained on the GTZAN dataset, achieving 57.5% accuracy, with segment-level MFCC spectrogram inputs.

Contextual Recommender Model leveraging user-provided mood and time of day alongside global audio features to suggest track-level equalization strategies.

Equalization Engine using FFT-based processing with overlap-add reconstruction to apply genre-specific frequency profiles.

Backend/API in ASP.NET Core, communicating asynchronously with a Flask AI microservice for model inference and audio processing.

Frontend developed in React with TypeScript, featuring configurable segmentation, context biasing, and custom EQ presets stored in a SQL database.

This end-to-end system demonstrates advanced integration of deep learning, audio signal processing, and full-stack engineering to create a personalized listening experience.
