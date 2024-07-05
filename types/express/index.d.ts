/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
    }
  }
}