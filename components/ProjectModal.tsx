"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  detailedDescription: string;
  technicalDetails: string;
  images?: string[];
  tech: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectModal({
  project,
  open,
  onOpenChange,
}: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto overscroll-contain bg-white/95 backdrop-blur-xl dark:bg-zinc-950/95 border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 pr-8">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Detailed Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Overview
            </h3>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {project.detailedDescription}
            </p>
          </div>

          {/* Technical Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Technical Implementation
            </h3>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {project.technicalDetails}
            </p>
          </div>

          {/* Project Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Project Gallery
              </h3>
              <div className={`grid gap-3 ${
                project.images.length === 1 
                  ? 'grid-cols-1' 
                  : project.images.length === 2 
                  ? 'grid-cols-2' 
                  : 'grid-cols-2 md:grid-cols-3'
              }`}>
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video overflow-hidden rounded-lg border-2 border-zinc-200 bg-zinc-50 transition-all hover:border-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-white"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 font-mono text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(project.github || project.demo) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {project.github && (
                <Button
                  asChild
                  variant="default"
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-400"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
              {project.demo && (
                <Button
                  asChild
                  variant="outline"
                  className="bg-white/50 backdrop-blur-sm hover:bg-white/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80"
                >
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Project
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
