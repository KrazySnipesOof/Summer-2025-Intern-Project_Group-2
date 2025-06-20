/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
//... rest of the test file
// src/setupTests.js

// This line is important for your tests, so we keep it.
import '@testing-library/jest-dom';

// This is the new mock code that will fix the Firebase error.
import { jest } from '@jest/globals';

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  onMessage: jest.fn(() => () => {}), // Mock onMessage to return a dummy unsubscribe function
}));