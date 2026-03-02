def main_menu():
    while True:
        print("1. Start NOSO-Launch")
        print("2. Play Mini-Game: Space Shooter")
        print("3. Quit")
        choice = input("Select an option: ")
        if choice == "1":
            start_noso_launch()
        elif choice == "2":
            play_mini_game()
        elif choice == "3":
            print("Goodbye!")
            break

def start_noso_launch():
    print("NOSO-Launch main game starting...")
    # Your existing main game code here

def play_mini_game():
    import minigame_spaceshooter
    minigame_spaceshooter.main()
    print("\nMini-game ended. Returning to main menu.\n")

if __name__ == "__main__":
    main_menu()