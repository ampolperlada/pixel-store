function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header>
      <h1>My Header</h1>
      {children}
    </header>
  );
}

export default Header;
