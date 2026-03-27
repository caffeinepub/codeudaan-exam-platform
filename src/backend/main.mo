import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ExamResult = {
    username : Text;
    email : Text;
    score : Nat;
    totalQuestions : Nat;
  };

  let results = Map.empty<Text, ExamResult>();

  public shared ({ caller }) func submitResult(username : Text, email : Text, score : Nat, totalQuestions : Nat) : async () {
    let result : ExamResult = {
      username;
      email;
      score;
      totalQuestions;
    };
    results.add(username, result);
  };

  public query ({ caller }) func getExamResult(username : Text) : async ExamResult {
    switch (results.get(username)) {
      case (null) { Runtime.trap("User result not found") };
      case (?result) { result };
    };
  };

  public query ({ caller }) func getAllResults() : async [ExamResult] {
    results.values().toArray();
  };
};
