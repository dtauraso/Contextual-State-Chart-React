# Contextual-State-Chart-React

# Techical document

# Front-End Plans

# Back-End system

types

states

variables

recording system

style matching closely to a programming languages
chaining
never have to directly access the type of variable to use it
all functional operations are done by chaining functions oop style
variable names are always 1 dimentional(1 string)

all recording and testing are done automatically with some parameters for controlling how much data is produced to prevent
too much data while allowing for enough to track changes

if your machine is so large that it's too slow it's probably not designed well.

design ideas
a state is a point in nth dimentiional space
[string_1, string_2, string_3, ...string_n]
1 trie tree for storing all the points in nth dimential space so user can understand the contexts used
in a ui side view
Using a hash table is unsuitable as it doesn't organize the hashes the way a trie can.
all things are states
states can be control flow, recording, variable containers, variable primitives

1 table for all states indexed by integer
keeps data structure flat with quick integer lookup

Each end node in the trie tree has an integer id to refer the multipart state name to the correct location in the table

using json for interfacing with the state table because json is easier to see structure of items
being sent to table and back

The user should not have to worry about how the machine works. They will mainly work in the UI.
don't use any external libraries unless it's for something minor(styling). This problem doesn't seem to have a universal solution and putting together part solutions is less effective than having a single universal solution.

parallel processing
acync with sync
https://www.enterpriseintegrationpatterns.com/docs/IEEE_Software_Design_2PC.pdf

parallel programming design:
lock the resources, and asign it to a job
all jobs should be designed to take the same amount of time(eventual ideal)
run multiple jobs at once
job dies if it takes too long
every sequence of related jobs(long job divided into smaller jobs) has a finite time limit
avoid the deadlock and livelock problems
use an integer lock for the number of dotted lines going into a rectangle from starbucks diagram from link on line 43

Warning:
This code has a few clean spots. There are old designs that haven't been resolved yet.
