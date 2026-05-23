import React from 'react';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-10 mt-auto border-t bg-background/50 px-4 py-2 backdrop-blur-md">
      <div className="text-center text-xs text-muted-foreground">
        <p>Zogna &copy; {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
}
