---
title: 'User Authentication from Mouse Movement Data Using Multiple Classifiers'
collection: publications
permalink: /publication/2017-02-icmlc-mouse
excerpt: 'User authentication from mouse movement trajectories, using twelve movement features with SVM, k-nearest-neighbour and naive Bayes classifiers.'
date: 2017-02-24
venue: 'International Conference on Machine Learning and Computing (ICMLC)'
paperurl: 'https://doi.org/10.1145/3055635.3056620'
citation: 'Masud Karim, Hasnain Heickal, and Md. Hasanuzzaman. "User Authentication from Mouse Movement Data Using Multiple Classifiers." ICMLC 2017, 122-127.'
published: true
tags:
  - security
---

## ABSTRACT
The biometric authentication is becoming very familiar due to its unique characteristics. This paper presents a user authentication system using mouse movement data. The mouse movement data are captured using an existing tool named Jitbit macro recorder. The acquired data are preprocessed and sampled into N blocks based on specific number of actions and stored in database. From each block twelve features are generated: Number of Points in the trajectory, Delay Time, Number of Delay, Number of Action, STDEV of Trajectory Length, Total Length of Trajectory, STDEV of Slope, STDEV of Slope to Slope Difference, Number of Curvatures, Curvature of Trajectory, Number of Changes in Horizontal Position and Number of Changes in Vertical Position. This system uses three separate classifiers: SVM, K-Nearest Neighbor and Naive Bayes to recognize the user. The system is trained and tested using a benchmark data. The experimental result shows that K-nearest Neighbor has the lowest error rate.
