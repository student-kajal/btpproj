const MainContent = ({ children }) => {
  return (
    <main className="flex-1 h-full overflow-auto bg-gray-50">
      {children}
    </main>
  );
};

export default MainContent;
