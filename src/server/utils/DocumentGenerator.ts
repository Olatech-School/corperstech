/**
 * DocumentGenerator.ts
 * 
 * Professional document generator engine for CorpersTech Career Resources,
 * Download Center, and system exports. Automatically generates high-quality,
 * ATS-optimized, and instructional resources when requested.
 * 
 * Modularized across PublicationContentPart1, Part2, and Part3 for scalable,
 * enterprise-grade Gold Master publications.
 */

import { PublicationContentPart1 } from './PublicationContentPart1.ts';
import { PublicationContentPart2 } from './PublicationContentPart2.ts';
import { PublicationContentPart3 } from './PublicationContentPart3.ts';

export class DocumentGenerator {
  /**
   * Generates or retrieves a professional document based on title and category.
   */
  static generateProfessionalDocument(
    title: string = "Career Resource",
    category: string = "Career Guide",
    type?: string
  ): { content: string; filename: string; contentType: string } {
    const cleanTitle = title.trim();
    const titleLower = cleanTitle.toLowerCase();
    const catLower = (category || type || "").toLowerCase();

    const content = 
      PublicationContentPart1.generate(titleLower, catLower, cleanTitle, category) ||
      PublicationContentPart2.generate(titleLower, catLower, cleanTitle, category) ||
      PublicationContentPart3.generate(titleLower, catLower, cleanTitle, category) ||
      "";

    // Format clean filename
    const cleanFilename = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      + ".md";

    const contentType = "text/markdown;charset=utf-8";

    return {
      content,
      filename: cleanFilename,
      contentType
    };
  }
}
