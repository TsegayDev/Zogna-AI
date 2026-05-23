import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t bg-background/50 px-4 py-2">
      <div className="text-center text-xs text-muted-foreground">
        <p>Admin Dashboard &copy; {new Date().getFullYear()}.</p>
      </div>
    </footer>
  );
}
