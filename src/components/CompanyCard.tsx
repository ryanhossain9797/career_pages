import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Company, Tag } from '../types/company'
import './CompanyCard.css'
import { getCardVariant } from '../lib/visuals'
import { useAuth } from '../context/AuthContext'

interface CompanyCardProps {
    company: Company
    id: number
    tags: Tag[]
    isBookmarked?: boolean
    onToggleBookmark?: () => Promise<void> | void
}

export function CompanyCard({ company, id, tags, isBookmarked = false, onToggleBookmark }: CompanyCardProps) {
    const isBroken = !company.name || !company.tagIds;
    const displayId = id.toString().padStart(8, '0');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [note, setNote] = useState('');
    const [isLoadingNote, setIsLoadingNote] = useState(false);
    const { user, profile, getNote, saveNote, deleteNote } = useAuth();
    const hasNote = (profile?.noteCompanyIds || []).includes(company.id);

    // Deterministic variant based on Index (per user request)
    const variantClass = getCardVariant(id);

    const handleBookmarkClick = async () => {
        if (onToggleBookmark && !isLoading) {
            setIsLoading(true);
            try {
                await onToggleBookmark();
            } finally {
                setTimeout(() => setIsLoading(false), 300);
            }
        }
    };

    const handleOpenNotesModal = async () => {
        if (!user) {
            alert('Please log in to add notes');
            return;
        }

        if (!company.id) {
            console.warn('Company id is undefined');
            return;
        }

        setIsLoadingNote(true);
        try {
            const existingNote = await getNote(company.id);
            setNote(existingNote || '');
            setIsNotesModalOpen(true);
        } catch (error) {
            console.error('Error loading note:', error);
            alert('Failed to load note');
        } finally {
            setIsLoadingNote(false);
        }
    };

    const handleSaveNote = async () => {
        if (!user) {
            alert('Please log in to save notes');
            return;
        }

        if (!company.id) {
            console.warn('Company id is undefined');
            return;
        }

        try {
            await saveNote(company.id, note);
            setIsNotesModalOpen(false);
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        }
    };

    const handleDeleteNote = async () => {
        if (!user || !company.id) return;

        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteNote(company.id);
            setNote('');
            setIsNotesModalOpen(false);
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    const handleCancel = () => {
        setIsNotesModalOpen(false);
        setNote('');
    };

    if (isBroken) {
        return (
            <section
                className="card company-card broken"
            >
                <div className="broken-title">MALFORMED DATA</div>
                <div className="broken-subtitle">
                    {company.name || company.id || `INDEX: ${id}`}
                </div>
            </section>
        );
    }

    return (
        <section className={`card company-card ${variantClass}`}>
            <div className="card-id">{displayId}</div>
            <h2 className="card-title">{company.name}</h2>
            <div className="card-subtitle">{company.location}</div>
            <div className="card-tags">
                {company.tagIds.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return (
                        <span key={tagId} className="tag">
                            {tag?.label || "Unknown Tag"}
                        </span>
                    );
                })}
                <button
                    onClick={handleBookmarkClick}
                    disabled={isLoading}
                    className={`tag link bookmark ${isBookmarked ? 'bookmarked' : 'unbookmarked'} ${isLoading ? 'loading' : ''}`}
                >
                    {isLoading ? '...' : isBookmarked ? 'BOOKMARKED' : 'BOOKMARK'}
                </button>
                <button
                    onClick={handleOpenNotesModal}
                    disabled={isLoadingNote}
                    className={`tag link notes ${hasNote ? 'has-note' : ''}`}
                >
                    {isLoadingNote ? '...' : hasNote ? 'NOTES ✎' : 'NOTES'}
                </button>
                {company.careerPageUrl && company.careerPageUrl.trim() !== "" && (
                    <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer" className="tag link">
                        CAREER PAGE ↗
                    </a>
                )}
                {company.linkedinUrl && company.linkedinUrl.trim() !== "" && (
                    <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tag link">
                        LINKEDIN ↗
                    </a>
                )}
            </div>

            {/* Notes Modal — rendered via portal so it's above all cards */}
            {isNotesModalOpen && createPortal(
                <div className="notes-modal-overlay" onClick={handleCancel}>
                    <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Notes for {company.name}</h3>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write your notes here..."
                            rows={12}
                            className="notes-textarea"
                        />
                        <div className="notes-modal-buttons">
                            {hasNote && (
                                <button onClick={handleDeleteNote} className="notes-modal-button delete">
                                    Delete
                                </button>
                            )}
                            <button onClick={handleCancel} className="notes-modal-button">
                                Cancel
                            </button>
                            <button onClick={handleSaveNote} className="notes-modal-button">
                                Save
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}
