def decide_on_model(model):
    """
    Small helper function to pipe all DB operations of a tilis model to the sde DB
    :param model:
    :return:
    """
    return 'sde' if model._meta.app_label == 'DoThi' else None


class SDEDBRouter:
    """
    Implements a database router so that:

    * Django related data - DB alias `default` - MySQL DB `world_django`
    * Legacy "world" database data (everything "non-Django") - DB alias `world_data` - MySQL DB `world`
    """

    def db_for_read(self, model, **hints):
        return decide_on_model(model)

    def db_for_write(self, model, **hints):
        return decide_on_model(model)

    def allow_relation(self, obj1, obj2, **hints):
        # Allow any relation if both models are part of the worlddata app
        if obj1._meta.app_label == 'DoThi' and obj2._meta.app_label == 'DoThi':
            return True
        # Allow if neither is part of worlddata app
        elif 'DoThi' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        # by default return None - "undecided"

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # allow migrations on the "default" (django related data) DB
        if db == 'default' and app_label != 'DoThi':
            return True

        # allow migrations on the legacy database too:
        # this will enable to actually alter the database schema of the legacy DB!
        if db == 'sde' and app_label == "DoThi":
            return True

        return False
