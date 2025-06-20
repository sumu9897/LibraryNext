import { NextFunction, Request, Response } from 'express';

export const home = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      message: '📚 Welcome to LibraryNext – A Modern Library Management API.',
      description:
        'LibraryNext is a robust system built with Express, TypeScript, and MongoDB to manage books, borrowing activities, and real-time availability efficiently.',
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error('Error in home controller:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      status: 500,
    });

    next(error);
  }
};
