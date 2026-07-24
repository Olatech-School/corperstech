import { Request, Response } from 'express';
import { DocumentRepository } from '../repositories/DocumentRepository.ts';

export class DocumentController {
  static async getAllDocuments(req: Request, res: Response) {
    try {
      const { role } = req.query; // optional role filter
      let docs = await DocumentRepository.getAllDocuments();

      // Apply visibility filter based on user role if provided
      if (role && typeof role === 'string' && role !== 'Super Admin') {
        docs = docs.filter(d => {
          if (!d.visibilityByRole || d.visibilityByRole === 'All') return true;
          const allowedRoles = d.visibilityByRole.split(',').map(r => r.trim());
          return allowedRoles.includes(role);
        });
      }

      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch documents.' });
    }
  }

  static async getDocumentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userEmail = req.query.email as string;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid document ID' });
      }

      const doc = await DocumentRepository.getDocumentById(id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Log reading history if user email is provided
      if (userEmail) {
        await DocumentRepository.logReading(id, userEmail);
      }

      const feedback = await DocumentRepository.getFeedback(id);
      const history = await DocumentRepository.getVersionHistory(id);

      res.json({
        document: doc,
        feedback,
        history
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch document' });
    }
  }

  static async createDocument(req: Request, res: Response) {
    try {
      const { title, category, content, version, author, status, tags, visibilityByRole } = req.body;
      if (!title || !category || !content) {
        return res.status(400).json({ error: 'Title, category, and content are required fields.' });
      }

      const newDoc = await DocumentRepository.createDocument({
        title,
        category,
        content,
        version: version || '1.0.0',
        author: author || 'Staff Admin',
        status: status || 'Published',
        tags: tags || '',
        visibilityByRole: visibilityByRole || 'All'
      });

      res.status(201).json(newDoc);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create document.' });
    }
  }

  static async updateDocument(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, category, content, version, author, status, tags, visibilityByRole, editorName } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid document ID' });
      }

      const updated = await DocumentRepository.updateDocument(id, {
        title,
        category,
        content,
        version,
        author,
        status,
        tags,
        visibilityByRole
      }, editorName || 'Super Admin');

      if (!updated) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update document.' });
    }
  }

  static async deleteDocument(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid document ID' });
      }

      const success = await DocumentRepository.deleteDocument(id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete document.' });
    }
  }

  static async getBookmarks(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'User email is required' });
      }

      const bookmarkedIds = await DocumentRepository.getBookmarks(email);
      res.json(bookmarkedIds);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch bookmarks.' });
    }
  }

  static async toggleBookmark(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { email } = req.body;

      if (isNaN(id) || !email) {
        return res.status(400).json({ error: 'Document ID and user email are required' });
      }

      const bookmarked = await DocumentRepository.toggleBookmark(id, email);
      res.json({ bookmarked });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to toggle bookmark.' });
    }
  }

  static async getReadingHistory(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'User email is required' });
      }

      const history = await DocumentRepository.getReadingHistory(email);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch reading history.' });
    }
  }

  static async submitFeedback(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { email, rating, isHelpful, suggestions, isOutdated, requestUpdate } = req.body;

      if (isNaN(id) || !email || rating === undefined) {
        return res.status(400).json({ error: 'Missing required feedback fields.' });
      }

      const feedback = await DocumentRepository.addFeedback({
        documentId: id,
        userEmail: email,
        rating: parseInt(rating),
        isHelpful: !!isHelpful,
        suggestions: suggestions || '',
        isOutdated: !!isOutdated,
        requestUpdate: !!requestUpdate
      });

      res.status(201).json(feedback);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to submit feedback.' });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const summary = await DocumentRepository.getAnalyticsSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch analytics.' });
    }
  }

  static async recordSearch(req: Request, res: Response) {
    try {
      const { keyword } = req.body;
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
      }

      await DocumentRepository.recordSearchKeyword(keyword);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to record search.' });
    }
  }
}
