---
title: How a model learns to listen
date: 5 Oct 2026
category: SPEECH
summary: A short walk through what a speech model actually trains on, and why the number that matters is the one you can measure.
cover: cover.jpg
---

A speech model does not hear a sentence. It hears a grid. Each column is a few milliseconds of sound, and each row is a slice of frequency. The first job of the system is to turn a voice into that grid without throwing away the parts a person would notice: a pause, a consonant, the way a vowel changes shape.

## The grid the model actually sees

That grid is usually built with MFCCs, a compact description of the spectrum. Compact matters. A minute of audio is a lot of numbers, and a model that trains for a hundred epochs will see those numbers again and again. If the front of the pipeline is careless, the rest of the network spends its capacity repairing the input.

![A waveform laid over soft frequency bands](cover.jpg)

The architecture I keep coming back to splits the work. A convolutional stack looks at local patterns, the way a short burst of energy marks a stop consonant. A transformer looks across the whole utterance, so a word at the end can still inform a word at the start. Neither piece is interesting on its own. The interesting part is the handoff: local evidence, then long context, then a sequence of tokens.

![Local frames underneath a few connected layers](layers.jpg)

## A number you can check

Training is where the story gets honest. Word error rate is a blunt score, which is why it is useful. On LJ Speech, a hybrid Transformer–CNN reached 2.58% WER. That figure does not mean the model understands speech. It means, on that dataset, after that training run, the transcripts were close. The next question is always the same: what happens when the room, the microphone, or the accent changes.

If you are writing the next note in this folder, start from a measurement you trust, then explain the pipeline that produced it. Readers can feel when a paragraph is doing real work.
