import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldExamResult = {
    username : Text;
    score : Nat;
    totalQuestions : Nat;
  };

  type OldActor = {
    results : Map.Map<Text, OldExamResult>;
  };

  type NewExamResult = {
    username : Text;
    email : Text;
    score : Nat;
    totalQuestions : Nat;
  };

  type NewActor = {
    results : Map.Map<Text, NewExamResult>;
  };

  public func run(old : OldActor) : NewActor {
    let newResults = old.results.map<Text, OldExamResult, NewExamResult>(
      func(_username, oldExamResult) {
        {
          oldExamResult with
          email = "unknown@codeudaan.com";
        };
      }
    );
    { results = newResults };
  };
};
