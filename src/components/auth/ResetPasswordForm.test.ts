/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer'

setupTests()

